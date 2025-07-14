<?php

/**
 * @OA\Info(
 *     title="Auto Fold Test API",
 *     version="1.0.0",
 *     description="Test API for auto fold functionality"
 * )
 */

class AutoFoldTestController
{
    /**
     * @OA\Get(
     *     path="/api/test",
     *     summary="Test endpoint",
     *     description="This is a test endpoint for auto fold",
     *     @OA\Response(
     *         response=200,
     *         description="Success response"
     *     )
     * )
     */
    public function testMethod()
    {
        return ['message' => 'Auto fold test'];
    }

    /**
     * Regular comment without Swagger annotations
     * This should not be folded
     */
    public function regularMethod()
    {
        return ['message' => 'Regular method'];
    }

    /**
     * @OA\Post(
     *     path="/api/test",
     *     summary="Another test endpoint",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Created"
     *     )
     * )
     */
    public function anotherTestMethod()
    {
        return ['message' => 'Another test'];
    }
}