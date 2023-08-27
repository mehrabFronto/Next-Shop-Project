import { toPersianDigits } from "@/utils/toPersianDigits";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiArrowNarrowRight } from "react-icons/hi";
import OTPInput from "react-otp-input";

const CheckOtpForm = ({
   phoneNumber,
   mutateCheckOtp,
   onBack,
   time,
   onResend,
}) => {
   const router = useRouter();
   const queryClient = useQueryClient();

   const [otp, setOtp] = useState("");

   const submitHandler = async (e) => {
      e.preventDefault();
      try {
         const { message, user } = await mutateCheckOtp({ phoneNumber, otp });
         queryClient.invalidateQueries({ queryKey: ["get-user"] });
         toast.success(message);
         if (user.isActive) router.push("/");
         else router.push("/complete-profile");
      } catch (error) {
         toast.error(error?.response?.data?.message || error.message);
      }
   };

   return (
      <form onSubmit={submitHandler}>
         <div className="mb-6">
            <button
               className="text-sm text-primary-600"
               type="button"
               onClick={onBack}>
               <HiArrowNarrowRight className="w-6 h-6 text-primary-600" />
            </button>
            <p className="text-xl font-bold text-slate-800 mt-2">
               کد تایید را وارد کنید:
            </p>
         </div>
         <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span className="text-slate-800 px-2"> </span>}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
               width: "40px",
               height: "45px",
               outline: "none",
               border: "2px solid #2563eb",
               borderRadius: "10px",
            }}
            containerStyle={{
               width: "100%",
               display: "flex",
               flexDirection: "row-reverse",
               alignItems: "center",
               justifyContent: "center",
               color: "#1e293b",
               marginBottom: "30px",
            }}
            shouldAutoFocus={true}
         />
         <button
            disabled={otp.length !== 6}
            className=" btn btn--primary mt-2 mb-4 disabled:opacity-50"
            type="submit">
            تایید
         </button>

         <div className="flex gap-x-2 mb-4 md:text-lg">
            <p>کد تایید برای {toPersianDigits(phoneNumber)} ارسال شد.</p>
            <button
               className="text-primary-600"
               type="button"
               onClick={onBack}>
               ویرایش؟
            </button>
         </div>

         {time > 0 ? (
            <p className="text-base">ارسال مجدد کد : {time}</p>
         ) : (
            <button
               className="text-primary-600 p-2"
               onClick={() => onResend(setOtp)}
               type="button">
               ارسال مجدد کد
            </button>
         )}
      </form>
   );
};

export default CheckOtpForm;
