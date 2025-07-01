<p align="center">
  <b>You're probably looking for <a href="https://placekitten.jcbhmr.com">placekitten.jcbhmr.com</a></b>
</p>

# PlaceKitten

😺 Reimplementation of [placekitten.com](https://placekitten.com)

<table align=center><td>

```
https://placekitten.jcbhmr.com/100/100
https://placekitten.jcbhmr.com/200/200
https://placekitten.jcbhmr.com/600/400
https://placekitten.jcbhmr.com/628/1254
```

<p align=center>
  <img src="https://placekitten.jcbhmr.com/400/200">
</p>

</table>

## Development

![Deno](https://img.shields.io/badge/Deno-222222?style=for-the-badge&logo=Deno&logoColor=70FFAF)

This project is built with [Deno](https://deno.com/) and
[Deno Deploy](https://deno.com/deploy).

**Why?**\
[placekitten.com](https://placekitten.com/) is down. 😢 And so I needed to
either a) find an alternative kitten image placeholder service or b) make my own
kitten image placeholder service.

The kitten images are from Unsplash. This service relies heavily on hotlinking
to Unsplash images via redirects and using their `w`, `h`, and `ar` query
parameters to resize the images.

> ## The Unsplash License
>
> Unsplash visuals are made to be used freely. Our license reflects that.
>
> ✅ All images can be downloaded and used for free\
> ✅ Commercial and non-commercial purposes\
> ✅ No permission needed (though attribution is appreciated!)
>
> What is not permitted 👎\
> ❌ Images cannot be sold without significant modification.\
> ❌ Compiling images from Unsplash to replicate a similar or competing service

&mdash; https://unsplash.com/license

Find more free-to-use kitten images:
https://unsplash.com/s/photos/kitten?license=free
