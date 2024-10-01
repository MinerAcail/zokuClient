import { Comments } from ".";


export const initialComments: Comments[] = [
    {
      id: 1,
      author: "JohnDoe",
      content:
        "This is a fantastic post! I really enjoyed reading it and learned a lot.",
      votes: 15,
      avatar: "/placeholder.svg?height=40&width=40",
      replies: [
        {
          id: 2,
          author: "JaneSmith",
          content:
            "I completely agree! The insights provided are really valuable.",
          votes: 7,
          avatar: "/placeholder.svg?height=40&width=40",
          replies: [{
            id: 4,
            author: "MichaelBrown",
            content: "I think there’s room for improvement, especially in the examples.",
            votes: 3,
            avatar: "/placeholder.svg?height=40&width=40",
            replies: [
              {
                id: 5,
                author: "ChrisLee",
                content:
                  "I second this! The examples were good, but some additional clarification would be helpful.",
                votes: 2,
                avatar: "/placeholder.svg?height=40&width=40",
                replies: [
                  {
                    id: 6,
                    author: "EmilyDavis",
                    content: "Agreed. More examples would enhance the clarity of the post.",
                    votes: 4,
                    avatar: "/placeholder.svg?height=40&width=40",
                    replies: [{
                      id: 4,
                      author: "MichaelBrown",
                      content: "I think there’s room for improvement, especially in the examples.",
                      votes: 3,
                      avatar: "/placeholder.svg?height=40&width=40",
                      replies: [
                        {
                          id: 5,
                          author: "ChrisLee",
                          content:
                            "I second this! The examples were good, but some additional clarification would be helpful.",
                          votes: 2,
                          avatar: "/placeholder.svg?height=40&width=40",
                          replies: [
                            {
                              id: 6,
                              author: "EmilyDavis",
                              content: "Agreed. More examples would enhance the clarity of the post.",
                              votes: 4,
                              avatar: "/placeholder.svg?height=40&width=40",
                              replies: [],
                            },
                          ],
                        },
                      ],
                    },],
                  },
                ],
              },
            ],
          },],
        },
      ],
    },
    {
      id: 3,
      author: "AliceJohnson",
      content:
        "Interesting perspective. I'd love to see more examples to support this.",
      votes: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      replies: [],
    },
    {
      id: 4,
      author: "MichaelBrown",
      content: "I think there’s room for improvement, especially in the examples.",
      votes: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      replies: [
        {
          id: 5,
          author: "ChrisLee",
          content:
            "I second this! The examples were good, but some additional clarification would be helpful.",
          votes: 2,
          avatar: "/placeholder.svg?height=40&width=40",
          replies: [
            {
              id: 4,
              author: "MichaelBrown",
              content: "I think there’s room for improvement, especially in the examples.",
              votes: 3,
              avatar: "/placeholder.svg?height=40&width=40",
              replies: [
                {
                  id: 5,
                  author: "ChrisLee",
                  content:
                    "I second this! The examples were good, but some additional clarification would be helpful.",
                  votes: 2,
                  avatar: "/placeholder.svg?height=40&width=40",
                  replies: [
                    {
                      id: 6,
                      author: "EmilyDavis",
                      content: "Agreed. More examples would enhance the clarity of the post.",
                      votes: 4,
                      avatar: "/placeholder.svg?height=40&width=40",
                      replies: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      author: "DavidClark",
      content:
        "Great post! I'd be interested in a follow-up that dives deeper into the technical details.",
      votes: 10,
      avatar: "/placeholder.svg?height=40&width=40",
      replies: [
        {
          id: 8,
          author: "SaraMiller",
          content:
            "Yes, a follow-up with more technical specifics would be awesome!",
          votes: 6,
          avatar: "/placeholder.svg?height=40&width=40",
          replies: [],
        },
      ],
    },
    {
      id: 9,
      author: "LauraWilson",
      content:
        "This post touched on a lot of important points, but I felt some sections were a bit too brief.",
      votes: 8,
      avatar: "/placeholder.svg?height=40&width=40",
      replies: [
        {
          id: 10,
          author: "JakeWilliams",
          content: "Same here. I felt the conclusion could have been expanded a bit more.",
          votes: 3,
          avatar: "/placeholder.svg?height=40&width=40",
          replies: [],
        },
      ],
    },
    {
      id: 11,
      author: "GeorgeM",
      content:
        "The post covers a wide range of topics efficiently. Kudos to the author!",
      votes: 12,
      avatar: "/placeholder.svg?height=40&width=40",
      replies: [
        {
          id: 12,
          author: "HannahKim",
          content: "Absolutely! The breadth of topics made it very engaging.",
          votes: 5,
          avatar: "/placeholder.svg?height=40&width=40",
          replies: [],
        },
      ],
    },
  ];