import Gweet from "components/Gweet";
import { useEffect, useState } from "react";
import { dbService, GWEET, storageService } from "setFirebase";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [gweet, setGweet] = useState("");
  const [allGweet, setAllGweet] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    dbService
      .collection(GWEET)
      .orderBy("createAt", "desc")
      .onSnapshot((snapshot) => {
        const gweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllGweet(gweetArray);
      });
    return () => {
      setAllGweet([]);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService //  ref 만들기(필수)
        .ref()
        .child(`${userObj.email}/images/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url"); //  파일 업로드
      attachmentUrl = await response.ref.getDownloadURL(); //  파일주소 받아오기
    }
    const gweetObj = {
      text: gweet,
      createAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection(GWEET).add(gweetObj);
    setGweet("");
    onClearAttachment();
  };

  const onTextChange = (e) => {
    const {
      target: { value },
    } = e;
    setGweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const {
        currentTarget: { result },
      } = event;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    const input = document.getElementById("fileInput");
    input.value = null;
    setAttachment("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          value={gweet}
          onChange={onTextChange}
          maxLength={120}
          required
        />
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input type="submit" value="Gweet" />
        {attachment !== "" && (
          <div>
            <img src={attachment} alt={attachment} height="150px" />
            <button onClick={onClearAttachment}>Clear Photo</button>
          </div>
        )}
      </form>
      <div>
        {allGweet.map((gweet) => {
          return (
            <Gweet
              key={gweet.id}
              gweetObj={gweet}
              isOwner={gweet.createrId === userObj.uid}
              isFrom={"Home"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
