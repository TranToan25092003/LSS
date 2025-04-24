import { toast } from "sonner";
import { redirect } from "react-router-dom";
import clerk from "./clerk";

export const authenTicationLoader = async () => {
  try {
    if (!clerk.isSignedIn) {
      toast("You must login first", {
        description: "Login please",
      });
      return redirect("/");
    }

    const role = (await clerk.user.getOrganizationMemberships()).data[0].role;

    if (!role.includes("admin")) {
      toast("You are not allow to access this page", {
        description: "Forbidden resource",
      });
      return redirect("/");
    }
  } catch (error) {
    toast(error?.message || "error");
  }
};
