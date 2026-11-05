const API_URL = "http://localhost:3000";

const app = Vue.createApp({
    data() {
        return {
            lessons: [],
            loading: true,
            error: "",
            sortBy: "subject",
            sortOrder: "asc",
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
    },
});

app.mount("#app");