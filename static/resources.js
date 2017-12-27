var tipList = [{
	id: 1,
	tip: "Companion planting is an excellent way to improve your garden. Some plants replenish nutrients lost by another one, and some combinations effectively keep pests away."
}, {
	id: 2,
	tip: "Compost needs time to integrate and stabilize in the soil. Apply two to three weeks prior to planting."
}, {
	id: 3,
	tip: "Like vining vegetables, but don’t have the room? Train your melons, squash, and cucumbers onto a vertical trellis or fence. Saves space and looks pretty too."
}, {
	id: 4,
	tip: "Garden vegetables that become over-ripe are an easy target for some pests. Remove them as soon as possible to avoid detection."
}, {
	id: 5,
	tip: "Milk jugs, soda bottles and other plastic containers make great mini-covers to place over your plants and protect them from frost."
}, {
	id: 6,
	tip: "Healthy soil means healthy plants that are better able to resist pests and disease, reducing the need for harmful pesticides."
}, {
	id: 7,
	tip: "Plants will do best if they are well suited to your growing area. Take some time to read up and choose plants accordingly."
}, {
	if: 8,
	tip: "Insects can’t stand plants such as garlic, onions, chives and chrysanthemums. Grow these plants around the garden to help repel insects."
}, {
	if: 9,
	tip: "Over watering is worse than under watering. It is easier to revive a dry plant than try to dry out drowned roots."
}, {
	if: 10,
	tip: "Some vegetables actually become better after a first frost, including kale, cabbage, parsnips, carrots, and Brussels sprouts."
}, {
	if: 11,
	tip: "When planting a flower or vegetable transplant, deposit a handful of compost into each hole. Compost will provide transplants with an extra boost that lasts throughout the growing season."
},
];

$(function() {
	$("#tip").hide();
	$("#tip").html(tipList[Math.floor(Math.random() * 11)].tip);
	$("#tip").slideDown();
	$("button").css("cursor", "pointer");
	$("#newtip").on("click", function() {
		var random = Math.floor(Math.random() * 11);
		$('#tip').hide();
		$('#tip').html(tipList[random].tip);
		$('#tip').slideDown();
	});
});