import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { authService, dbService, GWEET } from "setFirebase";
import Gweet from "components/Gweet";

const Profile = ({ userObj, refreshUser }) => {
  const [myGweets, setMyGweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
    console.log(userObj);
  };

  const getMyGweets = async () => {
    const gweets = await dbService
      .collection(GWEET)
      .where("createrId", "==", userObj.uid)
      .orderBy("createAt", "desc")
      .get();
    setMyGweets(gweets.docs.map((doc) => doc.data()));
  };

  const onProfileChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onProfileSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  useEffect(() => {
    getMyGweets();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>
      <form onSubmit={onProfileSubmit}>
        <input type="text" value={newDisplayName} onChange={onProfileChange} />
        <input type="submit" value="Update" />
      </form>
      <>
        {myGweets !== []
          ? myGweets.map((gweet, index) => {
              return (
                <Gweet
                  key={index}
                  gweetObj={gweet}
                  isOwner={gweet.createrId === userObj.uid}
                  isFrom={"Profile"}
                />
              );
            })
          : "Have no Gweets"}
      </>
    </>
  );
};

export default Profile;
