const API_URL = "http://localhost:3000";

const app = Vue.createApp({
    data() {
        return {
            lessons: [],
            loading: true,
            error: "",
        };
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