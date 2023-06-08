// To use any npm package, just import it
// import axios from "axios"

import axios from "axios";
export default defineComponent({
  async run({ steps, $ }) {
    // custom field key of the goals object.
    const customFieldKey = "07830b8b82772b06f0ff536731de4806f85bbcb8";
    const apiUrl = "https://api.pipedrive.com/v1/persons/search";
    const apiToken = PIPEDRIVE_API_KEY; // Replace with your Pipedrive API token
    const { email, goals } = steps.trigger.event.body; // Replace with the email ID you want to search
    console.log("email", email);
    console.log("goals", goals);
    // Make a GET request to search for a person using email ID
    const res = await axios
      .get(apiUrl, {
        params: {
          term: email,
          api_token: apiToken,
          start: 0,
        },
      })
      .catch((error) => {
        console.error("Error searching for person:", error);
      });

    // only update if goals is defined
    if (goals) {
      const foundPersons = await res.data.data;
      const personID = foundPersons.items[0].item.id;
      console.log(personID);

      // patch the person with new custom_property_value
      const updatedCustomFieldValue = goals;

      // Create the request payload with the updated custom field value
      const payload = {
        "69b01c8aa10d8f113647d8366118bfebadd94400": updatedCustomFieldValue,
      };

      // Make a PUT request to update the custom field value

      var response = await axios
        .put(`https://api.pipedrive.com/v1/persons/${personID}`, payload, {
          params: {
            api_token: apiToken,
          },
        })
        .catch((error) => {
          console.error("Error updating person:", error);
        });

      console.log(response.data);
    }

    // Reference previous step data using the steps object and return data to use it in future steps
    return response.data;
  },
});
