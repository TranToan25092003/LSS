import { toast } from "sonner";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { customFetch } from "@/utils/cutomAxios";

const Test = () => {
  const { getToken, isSignedIn, userId, orgRole, orgId } = useAuth();

  console.log(userId);

  console.log(orgRole);

  console.log(orgId);

  return (
    <>
      <Card>
        <Button
          size={"sm"}
          onClick={async () => {
            try {
              const token = await getToken();

              if (!token) {
                const data = await axios.get("http://localhost:3000");

                toast(data.data.message, {
                  description: "Connect to backend success 😊😊😊",
                  action: {
                    label: "Oke",
                    onClick: () => console.log("Undo"),
                  },
                });
              } else {
                const data = await customFetch.get("/", {
                  headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                  },
                });

                toast(data.data.message, {
                  description: "Connect to backend success 😊😊😊",
                  action: {
                    label: "Oke",
                    onClick: () => console.log("Undo"),
                  },
                });
              }
            } catch (error) {
              console.log(error.response?.data?.error);
              const messageError = error.response?.data?.error ?? "error";

              if (messageError) {
                toast(messageError, {
                  description: "Something wrong 😢😢😢",
                  action: {
                    label: ":(((",
                    onClick: () => console.log("Undo"),
                  },
                });
              }
            }
          }}
        >
          Check health system
        </Button>
      </Card>
    </>
  );
};

export default Test;
