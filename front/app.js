const API_URL = "http://localhost:3000";

const app = Vue.createApp({
    data() {
        return {
            lessons: [],
            loading: true,
            error: "",
            sortBy: "subject",
            sortOrder: "asc",
            cart: [],
            showCart: false,
        };
    },

    computed: {
        sortedLessons() {
            const sorted = [...this.lessons].sort((a, b) => {
                const x = a[this.sortBy];
                const y = b[this.sortBy];

                if (typeof x === "number")
                {
                    return x - y;
                }
                return x.localeCompare(y);
            });

            if (this.sortOrder === "desc")
            {
                sorted.reverse();
            }
            return sorted;
        },

        cartCount() {
            return this.cart.length;
        },

        cartLessons() {
            return this.lessons.filter((lesson) => this.cart.includes(lesson._id));
        },
    },

    async mounted() {
        await this.fetchLessons();
    },

    methods: {
        async fetchLessons() {
            try {
                const response = await fetch(`${API_URL}/lessons`);
                if (!response.ok)
                {
                    throw new Error("Request failed");
                }
                this.lessons = await response.json();
            }
            catch (err) {
                this.error = "Could not load lessons. Please try again later.";
            }
            finally {
                this.loading = false;
            }
        },

        addToCart(lesson) {
            if (lesson.availability > 0)
            {
                lesson.availability--;
                this.cart.push(lesson._id);
            }
        },

        quantityOf(lesson) {
            return this.cart.filter((id) => id === lesson._id).length;
        },

        removeOne(lesson) {
            const position = this.cart.indexOf(lesson._id);
            this.cart.splice(position, 1);
            lesson.availability++;
        },

        removeAll(lesson) {
            lesson.availability += this.quantityOf(lesson);
            this.cart = this.cart.filter((id) => id !== lesson._id);
        },
    },
});

app.mount("#app");