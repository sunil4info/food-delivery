export default {
	getOrders: async () => {
		const orders = await fetchOrdersQuery.run();
		const status = sel_status.selectedOptionValue;
		const date = dat_date.formattedDate;

		let filteredOrders = orders;

		if (status && status.length > 0) {
			filteredOrders = orders.filter(o => o.status === status);
		}

		if (date) {
			filteredOrders = orders.filter(o => new Date(o.created) === new Date(date))
		}

		const res = filteredOrders.map(o => {
			return {
				Id: o.id,
				OrderId: `OR00${o.id}`,
				PartnerName: o.partner_name,
				DropoffAddress: o.dropoff_address,
				PickupAddress: o.pickup_address,
				ETA: o.eta,
				Status:o.status,
				Driver: o.driver_name,
				Time: new Date(o.created).toLocaleTimeString(),
				OrderTime: new Date(o.created).toDateString(),
				Image: o.driver_image,
				NoOfItems: o.no_of_items,
				DriverPhone: o.driver_phone,
				Review: o.review,
				CustomerName: o.customer,
				CustomerPhone: o.customer_phone,
				Actual: o.delivery_time,
				PartnerLat: o.partner_lat,
				PartnerLong: o.partner_long,
				DriverLat: o.driver_lat,
				DriverLong: o.driver_long,
				OrderLong: o.order_long,
				OrderLat: o.order_lat,
			}
		});

		storeValue('orders', res)
		return res;
	},

	getTrackOrders: async () => {
		const orders = appsmith.store.orders;
		console.log('orders---',orders);
		console.log('OrderId---',orders.OrderId);

		return orders;
	},

	getCoords: async () => {
		if (lst_orders.selectedItem.Id) {
			// const status = lst_orders.selectedItem.Status;
			const allOrders = await this.getOrders();
			const order = allOrders.filter(o => o.Id === lst_orders.selectedItem.Id)[0];

			return [
				{
					lat: order.OrderLat,
					long: order.OrderLong,
					title: 'Customer',
				},
				{
					lat: order.PartnerLat,
					long: order.PartnerLong,
					title: 'Restaurant',
				},
				{
					lat: order.DriverLat,
					long: order.DriverLong,
					title: 'Driver',
				},
			]
		}
	},

	poolCoords: async () => {
		setInterval(async () => {
			const coords = await this.getCoords();
			storeValue('mapCoords', coords)
			console.log('coords pulled')
		}, 5000);
	},

	configureCoords: async () => {
		const coordinates = [
			[30.2676, -97.74298],
			[30.2674, -97.74245],
			[30.2672, -97.74192],
			[30.2669, -97.74137],
			[30.2666, -97.74082],
			[30.2664, -97.74027],
			[30.2662, -97.73972],
			[30.2659, -97.73917],
			[30.2656, -97.73862],
			[30.2654, -97.73807]
		];

		let index = 0;

		setInterval(() => {
			if (index < coordinates.length) {
				storeValue('mapCoords', {
					lat: coordinates[index][0],
					long: coordinates[index][1],
					title: 'Marker'
				})
				index++;
			}
		}, 1000)
	},
}