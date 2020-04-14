import axios from "axios"
import Config from "../assets/config"
import Utils from "./Utils"
import SideMenu from "./SideMenu"

// Share data fetch functions
export default {
	async categorizedItems (categoryType, categoryId) {
		// The fuction to process returned data from the Wordpress API
		const processItems = function (items) {
			return items.map(function (oneItem) {
				// const sideMenuItems = []
				if (categoryType === "views") {
					// original content:
					// aaa<h2>title</h2>
					// aaa<h2 id="unique-id">title</h2>

					// 1. extract side menu items for posts
					// 2. create unique ids for each side menu items
				}
				return {
					slug: oneItem.slug,
					title: oneItem.title.rendered,
					author: oneItem._embedded.author[0].name,
					// content: oneItem.content.rendered,
					content: SideMenu.injectHeaderID(oneItem.content.rendered),
					headers: SideMenu.getHeaderList(oneItem.content.rendered),
					// Strip html tags to get pure text for the content preview
					excerpt: Utils.stripHtmlTags(oneItem.excerpt.rendered),
					date: new Date(oneItem.date).toLocaleString("en-us", {
						year: "numeric",
						month: "long",
						day: "numeric"
					}),
					dateTime: oneItem.date,
					tags: oneItem.pure_taxonomies.tags ? oneItem.pure_taxonomies.tags.map(({ name }) => name) : [],
					picture: oneItem._links["wp:featuredmedia"] ? oneItem._embedded["wp:featuredmedia"][0].source_url : null,
					altTag: oneItem._links["wp:featuredmedia"] ? oneItem._embedded["wp:featuredmedia"][0].alt_text : "",
					// For news, "href" points to the external news links. For views, "href" is customized to show views content.
					href: categoryType === "news" ? oneItem.acf.link : "/views/" + oneItem.slug,
					isExternalHref: categoryType === "news",
					showPreviewImage: categoryType !== "news"
				}
			})
		}

		// According to the Wordpress API for pagination and embedding: https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/
		// 1. Fetch 100 records per page (the maxium number per page supported by Wordpress) to fasten the query
		// 2. Retrieve embedded resources in the main query
		const baseCategoryAPI = Config.wpDomain + Config.apiBase + "posts?categories=" + categoryId + "&per_page=100&_embed"

		// Fetch records for the first page as well as the number of total pages
		const firstPageRequest = baseCategoryAPI + "&page=1"
		const firstPageResponse = await axios.get(`${firstPageRequest}`)
		const totalPages = firstPageResponse.headers["x-wp-totalpages"]
		let results = []

		results = processItems(firstPageResponse.data)

		// Fetch records for page 2 onwards
		if (totalPages > 1) {
			for (let currentPageNum = 2; currentPageNum <= totalPages; currentPageNum++) {
				const currentPageResponse = await axios.get(`${baseCategoryAPI}&page=${currentPageNum}`)
				results = results.concat(processItems(currentPageResponse.data))
			}
		}
		return results
	},

	async sitePages () {
		// According to the Wordpress API for pagination and embedding: https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/,
		// fetch 100 records per page (the maxium number per page supported by Wordpress) to fasten the query
		const pageAPI = Config.wpDomain + Config.apiBase + "pages?per_page=100"

		const response = await axios.get(`${pageAPI}`)
		const slugsToExtractHeader = ["about", "inclusion-challenges"]

		return response.data.map(function (onePage) {
			const sideMenuItems = []
			if (slugsToExtractHeader.includes(onePage.slug)) {
				// extract headers
			}
			return {
				slug: onePage.slug,
				title: onePage.title.rendered,
				// content: onePage.content.rendered,
				content: SideMenu.injectHeaderID(onePage.content.rendered),
				headers: SideMenu.getHeaderList(onePage.content.rendered),
				// Strip html tags to get pure text for the content preview
				excerpt: Utils.stripHtmlTags(onePage.content.rendered),
				href: "/" + onePage.slug + "/",
				isExternalHref: false,
				sideMenuItems
			}
		})
	}
}
