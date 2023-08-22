import { invoke } from '@tauri-apps/api/tauri';
import { info } from "tauri-plugin-log-api";
import type { DeviceUserPackages, Package } from './models';

export async function adb_list_packages(
	deviceId: string,
	userId: string
): Promise<DeviceUserPackages> {
	info(`invoking packages - ${deviceId} - ${userId}`);

	const cmdOutpt: Package[] = await invoke('adb_list_packages', {
		deviceId: deviceId,
		userId: userId
	});
	return { device_id: deviceId, user_id: userId, packages: cmdOutpt };
}

export async function adb_disable_package(deviceId: string, userId: string, pkg: string) {
	info(`invoking disable - ${userId} - ${pkg}`);

	await invoke('adb_disable_clear_and_stop_package', {
		deviceId: deviceId,
		userId: userId,
		pkg: pkg
	});
}

export async function adb_enable_package(deviceId: string, userId: string, pkg: string) {
	info(`invoking enable - ${userId} - ${pkg}`);

	await invoke('adb_enable_package', {
		deviceId: deviceId,
		userId: userId,
		pkg: pkg
	});
}

export async function adb_install_package(deviceId: string, userId: string, pkg: string) {
	info(`invoking install - ${userId} - ${pkg}`);

	await invoke('adb_install_package', {
		deviceId: deviceId,
		userId: userId,
		pkg: pkg
	});
}
