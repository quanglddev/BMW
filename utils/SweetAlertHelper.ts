import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const displayError = (
  message: string,
  title: string = "Error",
  onFinished?: () => void
) => {
  const errorAlert = withReactContent(Swal);

  errorAlert
    .fire({
      title,
      text: message,
      icon: "error",
    })
    .then(() => {
      if (onFinished) {
        onFinished();
      }
    });
};

export const displaySuccess = (message: string, onFinished?: () => void) => {
  const errorAlert = withReactContent(Swal);

  errorAlert
    .fire({
      title: "Success",
      text: message,
      icon: "success",
    })
    .then(() => {
      if (onFinished) {
        onFinished();
      }
    });
};
