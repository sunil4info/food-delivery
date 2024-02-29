export default {
	addDelivery: async () => {
		const order = await Insert_public_delivery_order1.run();
		console.log('order---',order);
		showAlert('Order Added!', 'success')
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