import { useState } from "react";
import { dbService, GWEET, storageService } from "setFirebase";

const Gweet = ({ gweetObj, isOwner, isFrom }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editGweet, setEditGweet] = useState(gweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`${GWEET}/${gweetObj.id}`).delete();
      if (isFrom === "Home") {
        const input = document.getElementById("fileInput");
        input.value = null;
      }
      if (gweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(gweetObj.attachmentUrl).delete();
      }
    }
  };
  const onEditClick = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`${GWEET}/${gweetObj.id}`).update({
      text: editGweet,
    });
    setIsEditing((prev) => !prev);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setEditGweet(value);
  };

  return (
    <>
      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input type="text" value={editGweet} onChange={onChange} required />
          <input type="submit" value="Edit" />
        </form>
      ) : (
        <div>
          <h4>{gweetObj.text}</h4>
          {gweetObj.attachmentUrl !== "" && (
            <div>
              <img
                src={gweetObj.attachmentUrl}
                alt={gweetObj.attachmentUrl}
                height="150px"
              />
            </div>
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={onEditClick}>Edit</button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Gweet;
