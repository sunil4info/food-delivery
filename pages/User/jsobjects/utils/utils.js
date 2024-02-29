export default {
	getPartners: async () => {
		const allRestaurants = await GetRestaurants.run();
		const allCuisines = await GetPartnerCuisines.run();

		return allRestaurants.map(r => {
			return {
				PartnerID: `P00${r.id}`,
				Id: r.id,
				Name: r.name,
				Phone: r.phone,
				Address: r.address,
				Email: r.email,
				Category: allCuisines.filter(c => c.restaurant_id === r.id).map(c => c.cuisine_name),
				DeliveryCommission: r.commission,
				Revenue: r.revenue,
				Review: r.review,
				PrepTime: r.prep_time,
				MaxDeliveryTime: r.max_delivery_time,
				DeliveryRadius: r.delivery_radius,
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