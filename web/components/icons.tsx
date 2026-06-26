import {
  Newspaper,
  GraduationCap,
  ChartPie,
  Award,
  Building,
  Atom,
  Globe,
} from "flowbite-react-icons/outline";
import type { FlowbiteIconProps } from "flowbite-react-icons";
import type { ReportId } from "@/lib/plans";

export type IconComponent = React.ComponentType<FlowbiteIconProps>;

/** Flowbite outline icon per report — used in plan checklists and add-on buttons. */
export const REPORT_ICON: Record<ReportId, IconComponent> = {
  carta: Newspaper,
  aprofundamento: GraduationCap,
  carteira: ChartPie,
  rankings: Award,
  esp_fii: Building,
  esp_cripto: Atom,
  esp_global: Globe,
};
