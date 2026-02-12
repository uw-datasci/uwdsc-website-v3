export interface MarkAsPaidData {
  payment_method: "cash" | "online" | "math_soc";
  payment_location: string;
  verifier: string;
}
