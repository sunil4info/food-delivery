export default {
	getOrders: async () => {
		const allOrders = await fetchOrdersQuery.run();

		return allOrders.map(r => {
			return {
				Partner:r.partner_name,
				Restaurant: r.restaurant_name,
				Customer: r.customer,
				Id: r.id,
				Phone: r.phone,
				PickupAddrs: r.pickup_address,
				DropOffAddres: r.dropoff_address
			}
		})
	},

	getPartnerCuisines: async () => {
		const partnerCuisines = await GetSinglePartnerCuisines.run();

		return partnerCuisines;
	},

	getAllCuisines: async () => {
		const cuisines = await GetCuisine.run();

		return cuisines.map(c => {
			return {
				label: c.name,
				value: c.id,
			}
		})
	},

	addPartner: async () => {
		const partner = await createPartner.run();

		console.log('P:', partner);

		msl_newCuisines.selectedOptionValues.map(async v => {
			await createPartnerCuisine.run({
				cuisineId: v,
				restaurantId: partner[0].id,
			})
		});

		await this.getPartners();
		closeModal('mdl_newPartner');
		showAlert('Restaurant Added!', 'success')
	},

	updatePartner: async () => {
		await patchPartner.run();

		if (msl_cuisines.options.length > 0) {
			await deletePartnerCuisines.run();

			msl_cuisines.selectedOptionValues.map(async v => {
				await createPartnerCuisine.run({
					cuisineId: v,
					restaurantId: tbl_partners.selectedRow.Id,
				})
			})
		}

		const partners = await this.getPartners();
		storeValue('partner', partners.filter(p => p.Id === appsmith.store.partner.Id)[0]);
	},
}