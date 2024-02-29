export default {
	getDrivers: async () => {
		const allDrivers = await GetDrivers.run();
		const status = sel_driverStatus.selectedOptionValue;

		let filteredDriver = allDrivers;

		if (status) {
			const filteredData = allDrivers.filter(d => d.status === status);
			filteredDriver = filteredData;
		}

		return filteredDriver.map(m => {
			return {
				DriverID: `D00${m.id}`,
				ID: m.id,
				Photo: m.image,
				Name: m.fullname,
				Phone: m.phone,
				Address: m.address,
				Email: m.email,
				DeliveryCommission: m.commission,
				Vehicle: m.vehicle_type,
				Status: m.status
			}
		})
	},

	getDriverOrders: async () => {
		const driverOrders = await GetDriverOrders.run();

		return driverOrders.map(o => {
			return {
				Id: o.id,
				Time: new Date(o.created).toLocaleTimeString(),
				Name: o.customer,
				Address: o.pickup_address,
				Status: o.status,
				Rating: o.review,
			}
		})
	},

	viewDriverDetail: async () => {
		await this.getDriverOrders();
		showModal('mdl_driverDetails');
	},

	getVehicles: async () => {
		const vehicles = await GetVehicleType.run();

		return vehicles.map(v => {
			return {
				label: v.type,
				value: v.id,
			}
		})
	},

	getDeliveryZones: async () => {
		const deliveryZones = await GetDeliveryZone.run();

		return deliveryZones.map(v => {
			return {
				label: v.zone,
				value: v.id
			}
		})
	},

	addDriver: async () => {
		const profileImgExists = fpk_uploadImage.files && fpk_uploadImage.files.length > 0;
		let image = null;

		if (profileImgExists) {
			image = await uploadImage.run({
				data: fpk_uploadImage.files[0].data,
			});
		}

		const newDriver = await createDriver.run({
			image: profileImgExists ? image.url : null,
		});

		sel_deliveryAreas.selectedOptionValues.map(async v => {
			console.log('map', v)
			await createDeliveryDriverZone.run({
				driverId: newDriver[0].id,
				deliveryZoneId: v,
			})
		})

		await this.getDrivers();
		closeModal('mdl_addDriver');
		showAlert('Driver Created!', 'success');
	},

	driverStatusColor: (status) => {
		if (status === 'Active') {
			return 'RGB(0, 128, 0)'
		}
		if (status === 'Inactive') {
			return 'RGB(255, 0, 0)'
		}
		return 'RGB(255, 165, 0)';
	},
}