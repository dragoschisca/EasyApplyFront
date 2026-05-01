// Development environment — API points to local backend
// Production environment (environment.production.ts) points to Render deployment
export const environment = {
  production: false,
  apiUrl: "http://localhost:5077/api",
};
