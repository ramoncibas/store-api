const RevokedTokensSchema: string = `
  CREATE TABLE RevokedTokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export default RevokedTokensSchema;