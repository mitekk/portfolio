// src/assets/templates/index.ts

import template4 from "./4x4.json";
import template8 from "./8x8.json";
import template16 from "./16x16.json";
import type { Template, TemplateSize } from "../../types";

export const templates: Partial<Record<TemplateSize, Template[]>> = {
  4: template4 as Template[],
  8: template8 as Template[],
  16: template16 as Template[],
};
