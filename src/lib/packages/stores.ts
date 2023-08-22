import { selectedDeviceStore } from '$lib/devices/stores';
import { setErrorModal } from '$lib/error';
import { selectedUserStore } from '$lib/users/stores';
import { derived, get, writable, type Writable } from 'svelte/store';
import type { Package } from './models';
import { info } from "tauri-plugin-log-api";


function createPackagesStore() {
	const store = writable<Record<string, Package[]>>({});
	const { set, update, subscribe } = store;

	function setPackages(device_id: string, user_id: string, packages: Package[]) {
		update((store) => {
			let pkey = packagesKey(device_id, user_id);
			if (!pkey) {
				setErrorModal('pkey is empty');
				return store;
			}
			store[pkey] = packages;
			return store;
		});
	}

	function hasPackages(device_id: string, user_id: string): boolean {
		let pkey = packagesKey(device_id, user_id);
		if (!pkey) {
			return false;
		}
		return get(store).hasOwnProperty(pkey);
	}

	return {
		subscribe,
		setPackages,
		hasPackages
	};
}

export const packagesStore = createPackagesStore();

const packagesKey = (deviceId: string | undefined, userId: string | undefined): string | null => {
	if (!deviceId || !userId) {
		info(`pkey is null ${deviceId} ${userId}`);
		return null;
	}
	return `${deviceId}-${userId}`;
};

export const currentPackagesStore = derived(
	[packagesStore, selectedDeviceStore, selectedUserStore],
	([$packagesStore, $selectedDeviceStore, $selectedUserStore]) => {
		let user = $selectedUserStore;
		let pkey = packagesKey(user?.device_id, user?.id);
		if (!pkey) {
			return [];
		}
		let pkgs = $packagesStore[pkey];
		return pkgs || [];
	}
);

export const filteredPackages: Writable<Package[]> = writable([]);
export const searchTermStore = writable("");
