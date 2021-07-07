import { useEffect, useState } from "react";
import AppRouter from "components/AppRouter";
import { authService } from "setFirebase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName === null) {
          user.updateProfile({
            displayName: "Newbe",
          });
        }
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    console.log(authService.currentUser.displayName);
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return init ? (
    <AppRouter
      refreshUser={refreshUser}
      isLoggedIn={isLoggedIn}
      userObj={userObj}
    />
  ) : (
    "initialize..."
  );
}

export default App;
