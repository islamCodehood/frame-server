# frame-server

## User Model

- id
- name
- email
- password
- movies
- wantToWatch
- lists
- followers
- following

```
{
  id,
  name,
  email,
  password,
  movies: [
    {
      tmdb,
      rating,
      review
    }
  ],
  wantToWatch: [],
  lists: [{tmdb}],
  followers,
  following
}
```
