import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import Tags from '../../components/tags'

export default function Post({ post, posts, preview }) {
  const router = useRouter()
  const morePosts = posts?.edges

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta
                  property="og:image"
                  content={post.featuredImage?.sourceUrl}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.featuredImage}
                date={post.date}
                author={post.author}
                categories={post.categories}
              />
              <PostBody content={post.content} />
              <footer>
                {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
              </footer>
            </article>

            <SectionSeparator />
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          </>
        )}
      </Container>
    </Layout>
  )
}





export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  preview = false,
  previewData,

}) => {

  const slug = params?.slug;
 
  const host = req.headers.host;

  const referringURL = req.headers?.referer || null;
  const domain_url = process.env.WORDPRESS_API_URL as string;
  const data = await getPostAndMorePosts(params?.slug, preview, previewData)


	if (referringURL?.includes('facebook.com')) {
		return {
			redirect: {
				permanent: false,
				destination: `${
					domain_url.replace(/(\/graphql)/, '/') + encodeURI(slug  as string)
				}`,
			},
		};
	}
  

 
  

  return {
    props: {
      
      slug,
      host,
      preview,
      post: data.post,
      posts: data.posts,
    }
  }
}
