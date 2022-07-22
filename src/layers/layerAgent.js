import { mainCanal } from "@/layers/business_layer/mainCanal.js";
import { gate } from "@/layers/business_layer/gate.js";

export async function layerTest(map) {
  map.add(await mainCanal());
  map.add(await gate());
  // console.log(await mainCanal());
}