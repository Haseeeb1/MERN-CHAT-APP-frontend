import { useSelector } from "react-redux";
import { AppContext, socket } from "../context/appContext";
 
  const { socket } =useContext(AppContext);
  const user = useSelector((state) => state.user);
  const email=user.email;
   console.log(email);
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    socket.emit("tab-close", email);
});
