import { toast } from "sonner";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const Test = () => {
  return (
    <>
      <Card>
        <Label>test</Label>
        <CardTitle>test shacdn</CardTitle>
        <Separator></Separator>
        <Button
          size={"sm"}
          onClick={async () => {
            const data = await axios.get("http://localhost:3000");

            toast(data.data.message, {
              description: "Connect to backend success",
              action: {
                label: "Oke",
                onClick: () => console.log("Undo"),
              },
            });
          }}
        >
          Check health system
        </Button>
      </Card>
    </>
  );
};

export default Test;
