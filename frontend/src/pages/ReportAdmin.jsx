import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { customFetch } from "@/utils/customAxios";
import { toast } from "sonner";
import { useLoaderData } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const reportAdminLoader = async () => {
  try {
    const { data } = await customFetch.get("/admin/history/report");

    return {
      data: data.data,
    };
  } catch (error) {
    toast(error?.message || "error");
  }
};

const ReportAdmin = () => {
  const { data } = useLoaderData();

  console.log(data);

  return (
    <Accordion type="single" collapsible className="w-full">
      {data.map(({ report, user }) => {
        return (
          <AccordionItem key={report._id} value={report._id}>
            <AccordionTrigger>
              <div className="flex justify-between w-full">
                <h3 className="text-2xl"> {report.title}</h3>
                <div className="flex flex-col items-center p-0.5 mb-0.5">
                  <Avatar className={"mb-1"}>
                    <AvatarImage src={user.imageUrl}></AvatarImage>
                  </Avatar>
                  <div>
                    by: {user.firstName} {user.lastName}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div
                dangerouslySetInnerHTML={{ __html: report.description }}
                className="collapse-content text-sm"
              ></div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ReportAdmin;
