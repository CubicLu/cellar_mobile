export default interface CodeQuery {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
  };
}
