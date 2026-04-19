export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { identifier, password } = await readBody(event);

  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Identifier and password are required",
    });
  }

  try {
    const response = await $fetch<{ jwt: string; user: any }>(
      `${config.strapiBaseUrl}/api/auth/local`,
      {
        method: "POST",
        body: { identifier, password },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    let enrichedUser = response.user;

    if (response.jwt) {
      // Set the JWT as a secure, httpOnly cookie
      setCookie(event, "strapi_jwt", response.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Step 2: Fetch populated user data (with role)
      try {
        const userWithRole = await $fetch<any>(
          `${config.strapiBaseUrl}/api/users/me?populate=role`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${response.jwt}`,
            },
          },
        );
        console.log("asede kon", userWithRole);

        if (userWithRole) {
          enrichedUser = userWithRole;
        }
      } catch (meError) {
        // Fallback to basic user if the second request fails
        console.error("Failed to fetch enriched user data:", meError);
      }

      // Set a non-httpOnly cookie for the user data so the client store can hydrate
      setCookie(event, "strapi_user", JSON.stringify(enrichedUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // Return user info but NOT the JWT to the client
    return {
      user: enrichedUser,
    };
  } catch (error: any) {
    const statusCode = error?.response?.status || 401;
    const message = error?.data?.error?.message || "Authentication failed";

    throw createError({
      statusCode,
      statusMessage: message,
    });
  }
});
