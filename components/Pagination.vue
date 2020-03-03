<template>
	<nav class="pagination is-centered" role="navigation" aria-label="pagination">
		<nuxt-link v-if="currentPageNum > 1" :to="beforeLink" class="pagination-previous">
			Previous
		</nuxt-link>
		<nuxt-link v-if="currentPageNum < postsLen" :to="afterLink" class="pagination-next">
			Next
		</nuxt-link>
		<ul class="pagination-list">
			<li v-if="currentPageNum > 2">
				<nuxt-link :to="firstLink" class="pagination-link" aria-label="Goto page 1">
					1
				</nuxt-link>
			</li>
			<li v-if="before - 1 > 1">
				<span class="pagination-ellipsis">&hellip;</span>
			</li>
			<li v-if="currentPageNum > 1">
				<nuxt-link :to="beforeLink" :aria-label="`Goto page ${before}`" class="pagination-link">
					{{ before }}
				</nuxt-link>
			</li>
			<li>
				<nuxt-link :to="currentLink" :aria-label="`Goto page ${currentPageNum}`" class="pagination-link is-current" aria-current="page">
					{{ currentPageNum }}
				</nuxt-link>
			</li>
			<li v-if="currentPageNum < postsLen">
				<nuxt-link :to="afterLink" :aria-label="`Goto page ${after}`" class="pagination-link">
					{{ after }}
				</nuxt-link>
			</li>
			<li v-if="postsLen - after > 1">
				<span class="pagination-ellipsis">&hellip;</span>
			</li>
			<li v-if="currentPageNum < postsLen - 1">
				<nuxt-link :to="lastLink" :aria-label="`Goto page ${postsLen}`" class="pagination-link">
					{{ postsLen }}
				</nuxt-link>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
	props: {
		currentPageNum: {
			type: Number,
			default: 1
		},
		pageLinks: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		/**
	 * Count of paginated links.
	 * @method
	 */
		postsLen () {
			return this.pageLinks.length
		},
		/**
	 * Page number previous to current page number if current page number is less than or equal to 1 then value is 1.
	 * @method
	 */
		before () {
			if (this.currentPageNum <= 1) {
				return 1
			} else {
				return this.currentPageNum - 1
			}
		},
		/**
	 * Page number after current page number if current page number is greater than or equal to total count of paginated links(postLen) then value is postLen.
	 * @method
	 */
		after () {
			if (this.currentPageNum >= this.postsLen) {
				return this.postsLen
			} else {
				return this.currentPageNum + 1
			}
		},
		/**
	 * Link to first paginated page.
	 * @method
	 */
		firstLink () {
			return this.pageLinks[0]
		},
		/**
	 * Link to previous paginated page.
	 * @method
	 */
		beforeLink () {
			return this.pageLinks[this.before - 1]
		},
		/**
	 * Link to current paginated page.
	 * @method
	 */
		currentLink () {
			return this.pageLinks[this.currentPageNum - 1]
		},
		/**
	 * Link to next paginated page.
	 * @method
	 */
		afterLink () {
			return this.pageLinks[this.after - 1]
		},
		/**
	 * Link to last paginated page.
	 * @method
	 */
		lastLink () {
			return this.pageLinks[this.postsLen - 1]
		}
	}
}
</script>