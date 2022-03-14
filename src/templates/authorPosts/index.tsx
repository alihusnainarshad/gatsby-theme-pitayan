import React from "react"
import { graphql } from "gatsby"

import DefaultLayout from "@/layouts/Default"
import PostPanel from "@/components/PostPanel"
import Pagination from "@/components/Pagination"
import AuthorCard from "@/components/AuthorCard"

type AuthorPostsProps = {
  [key: string]: any
}

type PostsProps = {
  posts: any
}

const Posts: React.FC<PostsProps> = ({ posts }: PostsProps) => {
  return (
    <div className="grid relative grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map(({ node }: any) => {
        return <PostPanel post={node} key={node.id} />
      })}
    </div>
  )
}

const AuthorPosts: React.FC<AuthorPostsProps> = ({
  data: {
    allMdx: { edges: posts, pageInfo },
  },
  pageContext: { author },
}) => {
  return (
    <DefaultLayout>
      <AuthorCard data={author} />
      <hr className="my-8 border-gray-300" />
      <Posts posts={posts} />
      <div className="my-24">
        <Pagination
          pageInfo={pageInfo}
          path={`/authors/${author.replaceAll(" ", "-")}`}
        />
      </div>
    </DefaultLayout>
  )
}

export default AuthorPosts

export const pageQuery = graphql`
  query($limit: Int!, $skip: Int!, $author: String!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { author: { in: [$author] } } }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
      edges {
        node {
          id
          timeToRead
          fields {
            slug
          }
          frontmatter {
            title
            author
            categories
            date(formatString: "MMMM Do, YYYY")
            hero {
              normal: childImageSharp {
                gatsbyImageData(
                  width: 768
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            excerpt
          }
        }
      }
    }
  }
`
