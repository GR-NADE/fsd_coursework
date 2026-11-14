const API_URL = "http://localhost:3000";

const app = Vue.createApp({
    data() {
        return {
            lessons: [],
            loading: true,
            error: "",
            sortBy: "subject",
            sortOrder: "asc",
            searchText: "",
            matchingIds: [],
            selectedTeacher: "",
            cart: [],
            showCart: false,
            name: "",
            phone: "",
            orderPlaced: false,
            submitting: false,
            checkoutError: "",
        };
    },

    computed: {
        visibleLessons() {
            let result = this.lessons;

            if (this.searchText !== "")
            {
                result = result.filter((lesson) => this.matchingIds.includes(lesson._id));
            }

            if (this.selectedTeacher !== "")
            {
                result = result.filter((lesson) => lesson.teacher === this.selectedTeacher);
            }

            return result;
        },

        teacherNames() {
            return [...new Set(this.lessons.map((lesson) => lesson.teacher))];
        },

        sortedLessons() {
            const sorted = [...this.visibleLessons].sort((a, b) => {
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

        canCheckout() {
            const nameOk = /^[A-Za-z ]+$/.test(this.name) && this.name.trim() !== "";
            const phoneOk = /^[0-9]+$/.test(this.phone);
            return nameOk && phoneOk;
        },
    },

    watch: {
        searchText() {
            this.searchLessons();
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

        async searchLessons() {
            try {
                const query = encodeURIComponent(this.searchText);
                const response = await fetch(`${API_URL}/search?q=${query}`);
                const results = await response.json();
                this.matchingIds = results.map((lesson) => lesson._id);
            }
            catch (err)
            {
                this.matchingIds = [];
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

        goBack() {
            this.showCart = false;
            this.orderPlaced = false;
        },

        async checkout() {
            this.submitting = true;
            this.checkoutError = "";

            try {
                const order = {
                    name: this.name,
                    phone: this.phone,
                    lessons: this.cartLessons.map((lesson) => ({
                        lessonId: lesson._id,
                        quantity: this.quantityOf(lesson),
                    })),
                };

                const orderResponse = await fetch(`${API_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(order),
                });

                if (!orderResponse.ok)
                {
                    throw new Error("Order failed");
                }

                for (const lesson of this.cartLessons) {
                    const updateResponse = await fetch(`${API_URL}/lessons/${lesson._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ availability: lesson.availability }),
                    });

                    if (!updateResponse.ok)
                    {
                        throw new Error("Update failed");
                    }
                }

                this.cart = [];
                this.name = "";
                this.phone = "";
                this.orderPlaced = true;
            }
            catch (err) {
                this.checkoutError = "Could not place your order. Please try again.";
            }
            finally {
                this.submitting = false;
            }
        },
    },
});

app.mount("#app");