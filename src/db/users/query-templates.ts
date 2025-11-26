export const selectUsersTemplate = `
SELECT 
  u.id,
  u.name,
  u.username,
  u.email,
  u.phone,
  a.street,
  a.city,
  a.state,
  a.zipcode
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
ORDER BY u.name
LIMIT ?, ?
`;

export const selectCountOfUsersTemplate = `
SELECT COUNT(*) as count
FROM users
`;

export const selectUserByIdTemplate = `
SELECT 
  u.id,
  u.name,
  u.username,
  u.email,
  u.phone,
  a.street,
  a.city,
  a.state,
  a.zipcode
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
WHERE u.id = ?
`;
