import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { getFirebase, updateHead } from "./utils";
import { AppRouter } from "./AppRouter";
import "./styles.scss";
// import { useFirebase } from "src/utils";

function CanCanApp() {
  // const FirebaseContext = useFirebase();
  // useEffect(() => {
  //   getFirebase();
  // }, []);
  try {
    return (
      // <AuthProvider>
      <AppRouter />
      // </AuthProvider>
    );
  } catch (error) {
    return <></>;
  }
}

// Required for website to behave like a phone app on mobile devices
updateHead(document);

ReactDOM.render(<CanCanApp />, document.getElementById("app"));
