import type { Column } from "./column";
import type { GenericTableStructure } from "./generic-table";

export default interface InputStructure extends GenericTableStructure {
    "_pageID": Column<number, never, false>,
    "_pageName": Column<string, never, false>,
    "Key_remapping": Column,
    "Mouse_acceleration": Column,
    "Mouse_sensitivity": Column,
    "Mouse_input_in_menus": Column,
    "Mouse_Y_axis_inversion": Column,
    "Touchscreen": Column,
    "Controller_support": Column,
    "Full_controller_support": Column,
    "Controller_support_level": Column,
    "Controller_remapping": Column,
    "Controller_sensitivity": Column,
    "Controller_Y_axis_inversion": Column,
    "XInput_controller_support": Column,
    "Xbox_prompts": Column,
    "Xbox_One_Impulse_Triggers": Column,
    "DualShock_4_controller_support": Column,
    "DualShock_prompts": Column,
    "DualShock_4_light_bar_support": Column,
    "DualShock_4_connection_modes": Column<string[]>,
    "Tracked_motion_controllers": Column,
    "Tracked_motion_controller_prompts": Column,
    "Other_controller_support": Column,
    "Other_button_prompts": Column<string[]>,
    "Controller_hotplugging": Column,
    "Controller_haptic_feedback": Column,
    "Simultaneous_input": Column,
    "Steam_Input_API_support": Column,
    "Steam_hook_input": Column,
    "Steam_Input_presets": Column,
    "Steam_Controller_prompts": Column,
    "Steam_Input_mouse_cursor_detection": Column,
}
