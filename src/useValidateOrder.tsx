import { hexToString } from "viem";
import { useCheckOrder } from "./useCheckOrder";
import { signedOrderSchema } from "./utils/orderSchema";
import { parseOrderFromUrl } from "./utils/parseOrderFromUrl";

export const useValidateOrder = ({
  order,
  isUrl,
  onSetChain,
}: {
  order?: string;
  isUrl: boolean;
  onSetChain?: (chainId: number) => void;
}) => {
  let _order;
  let orderParsingError;
  if (order) {
    try {
      _order = isUrl ? parseOrderFromUrl(order) : JSON.parse(order);
    } catch (e) {
      orderParsingError = e;
    }
  }

  const schemaValidationResult = signedOrderSchema.safeParse(_order);

  const schemaValid = schemaValidationResult.success;

  if (schemaValid && schemaValidationResult.data.chainId) {
    onSetChain?.(schemaValidationResult.data.chainId);
  }

  const { data: orderErrors, error: contractCallError } = useCheckOrder({
    // FIXME: don't hardcode this - take from order if supplied, or get default for current chain.
    swapContract: {
      chainId: 11155111,
      address: "0xD82E10B9A4107939e55fCCa9B53A9ede6CF2fC46",
    },
    enabled: schemaValid,
    order: schemaValid ? schemaValidationResult.data : undefined,
  });

  return {
    orderErrors: orderErrors?.map((e) => hexToString(e)),
    contractCallError,
    orderParsingError,
    schemaValidationError: !schemaValid && schemaValidationResult.error,
  };
};
