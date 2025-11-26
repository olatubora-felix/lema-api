export const selectPostsTemplate = `
SELECT *
FROM posts
WHERE user_id = ?
ORDER BY created_at DESC
`;

export const deletePostTemplate = `
DELETE FROM posts
WHERE id = ?
`;

export const insertPostTemplate = `
INSERT INTO posts (id, user_id, title, body, created_at)
VALUES (?, ?, ?, ?, ?)
`;

export const selectPostByIdTemplate = `
SELECT *
FROM posts
WHERE id = ?
`;

export const selectUserByIdTemplate = `
SELECT id, 
  name,
  username,
  email,
  phone
FROM users
WHERE id = ?
`;
