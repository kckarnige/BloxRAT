export default async function handler(req, res) {

// Handle parameters
  const {
    userId,
    type = "full",
    isCircular = false,
    size = 420,
    format = "Png",
    responseType = "image",
  } = req.query;

// Make sure a user ID is provided
  if (!userId) {
    return res.status(400).json({ error: "User ID not specified!" });
  }

// Aliases (will be cleaned up later)
  const typeMap = {
    "full": "avatar",
    "bust": "avatar-bust",
    "headshot": "avatar-headshot",
    "face": "avatar-headshot",
    // So any existing instances don't break
    "avatar": "avatar",
    "avatar-bust": "avatar-bust",
    "avatar-headshot": "avatar-headshot"
  };

// Thumbnail url, and the user's profile page
  const thumbUrl = `https://thumbnails.roblox.com/v1/users/${typeMap[type]}?userIds=${userId}&size=${size}x${size}&format=${format}&isCircular=${isCircular}`;
  const userUrl = `https://users.roblox.com/v1/users/${userId}`;


// Attempt to fetch user data (should be 3 times max)
  try {
    const userPromise = fetch(userUrl);

    let attempt = 0;
    let thumbData, thumbJson, thumbRes;

    while (attempt <= 2) {
      thumbRes = await fetch(thumbUrl);
      if (!thumbRes.ok) break;
      thumbJson = await thumbRes.json();
      thumbData = thumbJson?.data?.[0];

      if (thumbData?.state === "Completed" && thumbData?.imageUrl) break;

      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 350));
      }
      attempt++;
    }

// Roblox API doesn't give the "OK" panic.
    if (!thumbRes?.ok) {
      return res.status(thumbRes.status).json({
        error: "Roblox API error, because...I'm not sure???",
        status: thumbRes.status
      });
    }

// User thumbnail couldn't be grabbed
    if (!thumbData?.imageUrl) {
      const state = thumbData?.state ?? "Unknown, user may not exist?";
      return res.status(202).json({
        error: "Roblox API refusal, user may contain deleted items",
        state,
        attempts: attempt
      });
    }

// Return user thumbnail
    if (responseType == "image") {
      const imageResponse = await fetch(thumbData.imageUrl);
      const contentType = imageResponse.headers.get("content-type");
      const buffer = await imageResponse.arrayBuffer();

      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).send(Buffer.from(buffer));
    }

// Return basic information about the user via JSON 
    if (responseType == "json") {
      const userRes = await userPromise;
      if (!userRes.ok) {
        return res.status(404).json({ error: "Roblox API, user info not found" });
      }

      const userJson = await userRes.json();

      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({
        userId: userJson.id,
        username: userJson.name,
        isBanned: userJson.isBanned,
        profileInfo: {
          created: userJson.created,
          hasVerifiedBadge: userJson.hasVerifiedBadge,
          displayName: userJson.displayName,
          description: userJson.description,
        },
        avatarThumbnail: {
          imageUrl: thumbData.imageUrl,
          state: thumbData.state,
          type,
          typeRaw: typeMap[type],
          size,
          isCircular,
          format
        }
      });
    }
    res.status(400).json({ error: "Invalid response type" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Roblox", details: error.message });
  }
}