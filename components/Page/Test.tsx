import * as React from "react";
import { Button, View, ActivityIndicator, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Credentials
const CLIENT_ID = "33036281551-rhg41tuqsqtp2i1lnjjb9lhvcd3rg0dq.apps.googleusercontent.com";
const REDIRECT_URI = makeRedirectUri({
  useProxy: true, // Required for Expo Go
});

const DISCOVERY = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function App() {
  const [authToken, setAuthToken] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["https://www.googleapis.com/auth/fitness.activity.read"],
      redirectUri: REDIRECT_URI,
    },
    DISCOVERY
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      console.log("✅ OAuth Success:", response);
      setAuthToken(response.authentication.accessToken);
    } else if (response?.type === "error") {
      console.error("❌ OAuth Error:", response);
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading && <ActivityIndicator size="large" color="blue" />}
      <Button
        title="Login with Google"
        disabled={!request}
        onPress={() => {
          setLoading(true);
          promptAsync();
        }}
      />
      {authToken && <Text>✅ Logged In! Token: {authToken}</Text>}
    </View>
  );
}
