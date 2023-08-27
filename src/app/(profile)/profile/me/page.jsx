"use client";

import TextField from "@/common/TextField";
import ThreeDotsLoading from "@/common/ThreeDotsLoading";
import { useGetUser } from "@/hooks/useAuth";
import { updateUserProfile } from "@/services/authService";
import { includeObj } from "@/utils/objectUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function MePage() {
   const { data, isLoading } = useGetUser();

   const [formData, setFormData] = useState({});
   const { user } = data || {};

   const includesKey = ["biography", "phoneNumber", "email", "name"];

   const { isLoading: isUpdating, mutateAsync } = useMutation({
      mutationFn: updateUserProfile,
   });

   const queryClient = useQueryClient();

   useEffect(() => {
      if (user) setFormData(includeObj(user, includesKey));
   }, [user]);

   const submitHandler = async (e) => {
      e.preventDefault();
      try {
         const { message } = await mutateAsync(formData);
         toast.success(message);
         queryClient.invalidateQueries({ queryKey: ["get-user"] });
      } catch (error) {
         toast.error(error?.response?.data?.message || error.message);
      }
   };

   if (isLoading) return <ThreeDotsLoading />;

   return (
      <div className="container max-w-md md:mt-20">
         <h1 className="text-2xl font-bold mb-4">اطلاعات کاربری</h1>
         <form
            onSubmit={submitHandler}
            className=" flex flex-col w-full bg-primary-200 p-6 pb-8 rounded-2xl shadow-xl">
            <div className="w-full flex flex-col-reverse gap-y-4 mb-8">
               {Object.keys(includeObj(user, includesKey)).map((key) => {
                  return (
                     <TextField
                        key={key}
                        name={key}
                        label={key}
                        value={formData[key] || ""}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              [e.target.name]: e.target.value,
                           })
                        }
                     />
                  );
               })}
            </div>
            <button
               className="btn btn--primary mt-2 disabled:opacity-50"
               type="submit">
               {isUpdating ? <ThreeDotsLoading /> : "ثبت"}
            </button>
         </form>
      </div>
   );
}
export default MePage;
