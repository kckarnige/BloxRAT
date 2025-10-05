![louie](./icon.svg)

# Blox R.A.T.

A simple little API for me to test Vercel, and for you to get whatever basic info you need about someone via the Roblox API. Say "thanks" to Louie!

*<sub>R.A.T. stands for Roblox Avatar Thumbnail.</sub>*

### Available Domains:

- bloxrat.vercel.app
- bloxrat.kckarnige.online


## Examples

### Image Example (Default)

[`https://bloxrat.vercel.app/api?userId=154248006&type=avatar-headshot&size=150&isCircular=false&responseType=image`](https://bloxrat.vercel.app/api?userId=154248006&type=avatar-headshot&size=150&isCircular=false&responseType=image)

![image example](https://bloxrat.vercel.app/api?userId=154248006&type=avatar-headshot&size=150&isCircular=false&responseType=image)

 ### JSON Example

[`https://bloxrat.vercel.app/api?userId=154248006&type=avatar-headshot&size=150&isCircular=false&responseType=json`](https://bloxrat.vercel.app/api?userId=154248006&type=avatar-headshot&size=150&isCircular=false&responseType=json)

```json
{
  "userId": 154248006,
  "username": "kayos155",
  "isBanned": false,
  "profileInfo": {
    "created": "2016-08-20T13:07:17.787Z",
    "hasVerifiedBadge": false,
    "displayName": "KiCKinTheBucket",
    "description": "ralsei my beloved"
  },
  "avatarThumbnail": {
    "imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-09738E13138A79DD35DDF52A9CCB347A-Png/150/150/AvatarHeadshot/Png/noFilter",
    "type": "avatar-headshot",
    "size": "150",
    "isCircular": "false",
    "format": "Png"
  }
}
```

## Parameters

### `userId` (String):

The Roblox user's ID. This can be found in the profile's URL.

<i><span>https://</span><span>ww</span>w.<span>roblox.</span>com/users/<b>154248006</b>/profile</i>

---

### `type` (String):

Sets what type of avatar thumbnail is returned as the image.

Options: `avatar` (default), `avatar-bust`, `avatar-headshot`.

---

### `size` (Integer):

Sets what size the returned image is. To get a full list of supported sizes, make sure to check the official API docs, linked at the end. The options listed are sizes supported by all thumbnail types.

Options: `48`, `60`, `75`, `100`, `150`, `180`, `420` (default), `720`

---

### `isCircular` (Boolean):

Sets whether or not the returned image is circular.

Options: `true`, `false` (default)

---

### `format` (String):

Sets what file format the returned image is. `jpeg` format is not supported for `avatar-bust` thumbnails.

Options: `png` (default), `webp`, `jpeg`

---

### `responseType` (String):

Sets whether to return an image for thing such as `<img>` elements, or JSON which includes the image URL as well as a bit more info about the user.

Options: `image` (default), `json`

---

For more detailed information on the different parameters and such, check out the official Roblox avatar thumbnail v1 docs:
https://create.roblox.com/docs/cloud/features/avatars#/default/get_v1_users_avatar
