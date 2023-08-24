import { couponListTableTHeads } from "@/constants/tableHeads";
import { priceUtils } from "@/utils/priceUtils";
import { toLocaleDateString } from "@/utils/toLocalDateString";
import { toPersianDigits } from "@/utils/toPersianDigits";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const CouponsTable = ({ coupons, onRemoveCoupon }) => {
   return (
      <div className="overflow-auto pb-2 customScrollBar">
         <table className="border-collapse table-auto w-full min-w-[800px] text-sm">
            <thead>
               <tr>
                  {couponListTableTHeads.map((item) => {
                     return (
                        <th
                           className="table__th"
                           key={item.id}>
                           {item.label}
                        </th>
                     );
                  })}
               </tr>
            </thead>
            <tbody>
               {coupons.map((coupon, index) => {
                  return (
                     <tr key={coupon._id}>
                        <td className="table__td">{toPersianDigits(index)}</td>
                        <td className="table__td whitespace-nowrap font-bold">
                           {coupon.code}
                        </td>
                        <td className="table__td">{coupon.type}</td>
                        <td className="table__td">
                           {toPersianDigits(priceUtils(coupon.amount))}
                           {coupon.type === "percent" ? "%" : ""}
                        </td>
                        <td className="table__td">
                           <div className="space-y-2 flex flex-col items-start">
                              {coupon.productIds.map((p) => {
                                 return <span key={p._id}>{p.title}</span>;
                              })}
                           </div>
                        </td>
                        <td className="table__td">
                           {toPersianDigits(coupon.usageCount)}
                        </td>
                        <td className="table__td">
                           {toPersianDigits(coupon.usageLimit)}
                        </td>
                        <td className="table__td">
                           {toLocaleDateString(coupon.expireDate)}
                        </td>
                        <td className="table__td">
                           <div className="flex items-center gap-x-2">
                              <button
                                 onClick={() => onRemoveCoupon(coupon._id)}>
                                 <TrashIcon className="w-6 h-6 text-red-500" />
                              </button>
                              <Link
                                 className="block text-secondary-600"
                                 href={`/admin/coupons/edit/${coupon._id}`}>
                                 <PencilSquareIcon className="w-6 h-6" />
                              </Link>
                           </div>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
};

export default CouponsTable;
