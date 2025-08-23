const dbName = "wisniowyPlanDB";
let version = 2;

export enum Stores {
	Plans = "plans",
	LessonNames = "lesson-names",
	TeacherNames = "teacher-names",
	ClassroomNames = "classroom-names",
	Filters = "plan-filters",
}

export const initDB = (): Promise<boolean> => {
	return new Promise((resolve) => {
		// open the connection
		const request = indexedDB.open(dbName, version);

		request.onupgradeneeded = () => {
			const db = request.result;

			// if the data object store doesn't exist, create it
			if (!db.objectStoreNames.contains(Stores.Plans)) {
				console.log("Creating plans store");
				db.createObjectStore(Stores.Plans, { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains(Stores.LessonNames)) {
				console.log("Creating lessonNames store");
				db.createObjectStore(Stores.LessonNames, { keyPath: "name" });
			}
			if (!db.objectStoreNames.contains(Stores.TeacherNames)) {
				console.log("Creating teachers store");
				db.createObjectStore(Stores.TeacherNames, {
					keyPath: "initials",
				});
			}
			if (!db.objectStoreNames.contains(Stores.ClassroomNames)) {
				console.log("Creating classrooms store");
				db.createObjectStore(Stores.ClassroomNames, {
					keyPath: "room",
				});
			}
			if (!db.objectStoreNames.contains(Stores.Filters)) {
				console.log("Creating filters store");
				db.createObjectStore(Stores.Filters, { keyPath: "class" });
			}
			// no need to resolve here
		};

		request.onsuccess = () => {
			const db = request.result;
			version = db.version;
			// console.log("request.onsuccess - initDB", version);
			resolve(true);
		};

		request.onerror = () => {
			resolve(false);
		};
	});
};

export const addData = <T>(
	storeName: string,
	data: T
): Promise<T | string | null> => {
	return new Promise((resolve) => {
		const request = indexedDB.open(dbName, version);

		request.onsuccess = () => {
			// console.log("request.onsuccess - addData", data);
			const db = request.result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);
			store.add(data);
			resolve(data);
		};

		request.onerror = () => {
			const error = request.error?.message;
			if (error) {
				resolve(error);
			} else {
				resolve("Unknown error");
			}
		};
	});
};

export const updateData = <T>(
	storeName: string,
	key: string,
	data: T
): Promise<T | string | null> => {
	return new Promise((resolve) => {
		const request = indexedDB.open(dbName, version);

		request.onsuccess = () => {
			// console.log("request.onsuccess - updateData", key);
			const db = request.result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);
			const res = store.get(key);
			res.onsuccess = () => {
				const newData = { ...res.result, ...data };
				store.put(newData);
				resolve(newData);
			};
			res.onerror = () => {
				resolve(null);
			};
		};
	});
};

export const deleteData = (
	storeName: string,
	key: string
): Promise<boolean> => {
	return new Promise((resolve) => {
		// again open the connection
		const request = indexedDB.open(dbName, version);

		request.onsuccess = () => {
			// console.log("request.onsuccess - deleteData", key);
			const db = request.result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);
			const res = store.delete(key);

			// add listeners that will resolve the Promise
			res.onsuccess = () => {
				resolve(true);
			};
			res.onerror = () => {
				resolve(false);
			};
		};
	});
};

export const getData = <T>(
	storeName: Stores,
	key: string
): Promise<T | null> => {
	return new Promise((resolve) => {
		const request = indexedDB.open(dbName);

		request.onsuccess = () => {
			// console.log("request.onsuccess - getData", key);
			const db = request.result;
			const tx = db.transaction(storeName, "readonly");
			const store = tx.objectStore(storeName);
			const res = store.get(key);
			res.onsuccess = () => {
				resolve(res.result);
			};
			res.onerror = () => {
				resolve(null);
			};
		};
	});
};

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
	return new Promise((resolve) => {
		const request = indexedDB.open(dbName);

		request.onsuccess = () => {
			// console.log("request.onsuccess - getAllData");
			const db = request.result;
			const tx = db.transaction(storeName, "readonly");
			const store = tx.objectStore(storeName);
			const res = store.getAll();
			res.onsuccess = () => {
				resolve(res.result);
			};
			res.onerror = () => {
				resolve([]);
			};
		};
	});
};
