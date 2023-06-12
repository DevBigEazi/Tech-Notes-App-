import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const users = useSelector(selectAllUsers);
  console.log(users);

  if (!users?.length) return <p>Not Currently Available</p>;

  return <NewNoteForm users={users} />;
};
export default NewNote;
