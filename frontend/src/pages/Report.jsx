import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import clerk from "@/utils/clerk";
import { redirect } from "react-router-dom";
import { toast } from "sonner";
import { ReportSchema, validateWithZodSchema } from "@/utils/schema";
import Swal from "sweetalert2";
import { customFetch } from "@/utils/customAxios";

export const reportLoader = async () => {
  try {
    if (!clerk.isSignedIn) {
      toast("You must login first", {
        description: "Login please",
      });
      return redirect("/");
    }
  } catch (error) {
    toast("error");
  }
};

export default function Report() {
  const editorRef = useRef(null);

  const [title, setTitle] = useState([]);

  return (
    <>
      <Label className={"text-3xl capitalize"}>tittle</Label>
      <Input
        type={"text"}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        required
        className={"my-3 border-2"}
      ></Input>

      <Label className={"text-3xl capitalize"}>description</Label>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_KEY}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue="<p>enter your problem</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <Button
        onClick={() => {
          const data = {
            title: title,
            description: editorRef.current.getContent(),
          };

          try {
            const correctData = validateWithZodSchema(ReportSchema, data);

            const confirmReport = () => {
              Swal.fire({
                title: "Send report",
                text: "Are your sure?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Send",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
              }).then(async (result) => {
                await customFetch.post("/report", correctData);

                if (result.isConfirmed) {
                  Swal.fire("Success!", "Send report", "success");
                }

                setTitle("");
                editorRef.current.setContent("<p>enter your problem</p>");
              });
            };
            confirmReport();
          } catch (error) {
            toast("", {
              description: error?.message || "something wrong 😢😢😢",
            });
          }
        }}
        size={"lg"}
        className={"mt-2 cursor-pointer hover:bg-amber-950"}
      >
        Submit
      </Button>
    </>
  );
}
